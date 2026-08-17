"""Regression tests for candidate, job, validation, and matching APIs."""
import os
import uuid

import pytest
import requests


BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")


@pytest.fixture(scope="module")
def api():
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session


@pytest.fixture(scope="module")
def test_data(api):
    suffix = uuid.uuid4().hex[:8]

    candidate = {
        "name": f"TEST Candidate {suffix}",
        "contact_number": "5550100",
        "email": f"test-{suffix}@example.com",
        "skills": ["Python", "React"],
        "qualification": "B.Tech",
        "college": "TEST College",
        "grade": "8.5",
    }

    response = api.post(
        f"{BASE_URL}/api/candidates",
        json=candidate,
        timeout=20,
    )

    assert response.status_code == 201, response.text

    created_candidate = response.json()

    assert isinstance(
        created_candidate.get("id"),
        str,
    )

    jobs = []

    for title, skills, link in [
        (
            f"TEST Strong {suffix}",
            ["python", "REACT", "Go"],
            "https://example.com/strong",
        ),
        (
            f"TEST Weak {suffix}",
            ["PYTHON"],
            "https://example.com/weak",
        ),
        (
            f"TEST None {suffix}",
            ["Java"],
            "https://example.com/none",
        ),
    ]:
        job_response = api.post(
            f"{BASE_URL}/api/jobs",
            json={
                "title": title,
                "company": "TEST Co",
                "required_skills": skills,
                "link": link,
            },
            timeout=20,
        )

        assert job_response.status_code == 201, job_response.text
        jobs.append(job_response.json())

    return created_candidate, jobs


def test_health(api):
    response = api.get(
        f"{BASE_URL}/api/",
        timeout=20,
    )

    assert response.status_code == 200
    assert response.json()["message"]


def test_candidate_persists_without_object_id(api, test_data):
    candidate, _ = test_data

    response = api.get(
        f"{BASE_URL}/api/candidates/{candidate['id']}",
        timeout=20,
    )

    assert response.status_code == 200
    assert response.json()["email"] == candidate["email"]
    assert "_id" not in response.json()


def test_jobs_list_contains_created_jobs_without_object_id(
    api,
    test_data,
):
    _, jobs = test_data

    response = api.get(
        f"{BASE_URL}/api/jobs",
        timeout=20,
    )

    assert response.status_code == 200

    titles = {
        job["title"]
        for job in response.json()
    }

    assert {
        job["title"]
        for job in jobs
    } <= titles

    assert all(
        "_id" not in job
        for job in response.json()
    )


def test_matching_is_case_insensitive_sorted_and_excludes_nonmatches(
    api,
    test_data,
):
    candidate, jobs = test_data

    response = api.post(
        f"{BASE_URL}/api/candidates/{candidate['id']}/match",
        timeout=20,
    )

    assert response.status_code == 200

    matches = response.json()

    by_title = {
        item["title"]: item
        for item in matches
    }

    assert (
        jobs[0]["title"] in by_title
        and by_title[jobs[0]["title"]][
            "overlapping_skills_count"
        ] == 2
    )

    assert (
        jobs[1]["title"] in by_title
        and by_title[jobs[1]["title"]][
            "overlapping_skills_count"
        ] == 1
    )

    assert jobs[2]["title"] not in by_title

    assert [
        item["overlapping_skills_count"]
        for item in matches
    ] == sorted(
        (
            item["overlapping_skills_count"]
            for item in matches
        ),
        reverse=True,
    )


@pytest.mark.parametrize(
    "payload",
    [
        {
            "name": "missing fields",
        },
        {
            "name": "x",
            "contact_number": "1",
            "email": "x",
            "skills": [],
            "qualification": "q",
            "college": "c",
            "grade": "g",
        },
    ],
)
def test_invalid_candidate_returns_json_4xx(
    api,
    payload,
):
    response = api.post(
        f"{BASE_URL}/api/candidates",
        json=payload,
        timeout=20,
    )

    assert 400 <= response.status_code < 500
    assert isinstance(response.json(), dict)


def test_invalid_job_url_returns_json_4xx(api):
    response = api.post(
        f"{BASE_URL}/api/jobs",
        json={
            "title": "TEST invalid",
            "company": "Co",
            "required_skills": ["Python"],
            "link": "not-a-url",
        },
        timeout=20,
    )

    assert 400 <= response.status_code < 500
    assert isinstance(response.json(), dict)


def test_unknown_candidate_returns_json_404(api):
    missing = str(uuid.uuid4())

    response = api.get(
        f"{BASE_URL}/api/candidates/{missing}",
        timeout=20,
    )

    assert response.status_code == 404
    assert response.json().get("detail") == "Candidate not found"

    match_response = api.post(
        f"{BASE_URL}/api/candidates/{missing}/match",
        timeout=20,
    )

    assert match_response.status_code == 404
    assert (
        match_response.json().get("detail")
        == "Candidate not found"
    )
