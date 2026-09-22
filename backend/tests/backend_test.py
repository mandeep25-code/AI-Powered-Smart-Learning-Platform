"""SmartLearn backend integration tests (Node/Express + Mongo). JWT Bearer."""
import os
import time
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://learn-hub-pro-37.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

STUDENT = {"email": "student@smartlearn.com", "password": "Student@123"}
TEACHER = {"email": "teacher@smartlearn.com", "password": "Teacher@123"}
ADMIN = {"email": "admin@smartlearn.com", "password": "Admin@123"}


def _login(creds):
    r = requests.post(f"{API}/auth/login", json=creds, timeout=30)
    assert r.status_code == 200, f"Login failed {r.status_code} {r.text}"
    return r.json()["token"]


@pytest.fixture(scope="session")
def student_token():
    return _login(STUDENT)


@pytest.fixture(scope="session")
def teacher_token():
    return _login(TEACHER)


@pytest.fixture(scope="session")
def student_hdr(student_token):
    return {"Authorization": f"Bearer {student_token}"}


@pytest.fixture(scope="session")
def teacher_hdr(teacher_token):
    return {"Authorization": f"Bearer {teacher_token}"}


# ---------- Health ----------
def test_health():
    r = requests.get(f"{API}/health", timeout=10)
    assert r.status_code == 200
    assert r.json().get("status") == "healthy"


# ---------- Auth ----------
class TestAuth:
    def test_register_student(self):
        email = f"TEST_stu_{uuid.uuid4().hex[:8]}@ex.com"
        r = requests.post(f"{API}/auth/register", json={
            "name": "Test Student", "email": email, "password": "Passw0rd!", "role": "student"
        }, timeout=30)
        assert r.status_code in (200, 201), r.text
        data = r.json()
        assert "token" in data and data["user"]["role"] == "student"

    def test_register_teacher(self):
        email = f"TEST_tea_{uuid.uuid4().hex[:8]}@ex.com"
        r = requests.post(f"{API}/auth/register", json={
            "name": "Test Teacher", "email": email, "password": "Passw0rd!", "role": "teacher"
        }, timeout=30)
        assert r.status_code in (200, 201), r.text
        assert r.json()["user"]["role"] == "teacher"

    def test_login_seeded(self):
        for c in (STUDENT, TEACHER, ADMIN):
            r = requests.post(f"{API}/auth/login", json=c, timeout=30)
            assert r.status_code == 200, f"{c['email']} => {r.status_code} {r.text}"
            assert "token" in r.json()

    def test_login_invalid(self):
        r = requests.post(f"{API}/auth/login", json={"email": "student@smartlearn.com", "password": "wrong"}, timeout=30)
        assert r.status_code in (400, 401)

    def test_me(self, student_hdr):
        r = requests.get(f"{API}/auth/me", headers=student_hdr, timeout=30)
        assert r.status_code == 200
        assert r.json()["user"]["email"] == STUDENT["email"]

    def test_update_profile(self, student_hdr):
        r = requests.put(f"{API}/users/profile", headers=student_hdr,
                         json={"bio": "TEST bio " + uuid.uuid4().hex[:6]}, timeout=30)
        assert r.status_code == 200, r.text
        me = requests.get(f"{API}/auth/me", headers=student_hdr, timeout=30).json()["user"]
        assert me["bio"].startswith("TEST bio")


# ---------- Dashboard + Gamification ----------
class TestDashboardGamification:
    def test_dashboard(self, student_hdr):
        r = requests.get(f"{API}/dashboard", headers=student_hdr, timeout=30)
        assert r.status_code == 200, r.text
        d = r.json()
        for k in ("stats", "recommendations", "recentActivity", "achievements"):
            assert k in d, f"missing {k}"
        for k in ("streak", "studyMinutes", "xp", "level", "avgQuizScore"):
            assert k in d["stats"], f"stats missing {k}"

    def test_session_awards_xp(self, student_hdr):
        me1 = requests.get(f"{API}/auth/me", headers=student_hdr).json()["user"]
        r = requests.post(f"{API}/gamification/session", headers=student_hdr,
                          json={"minutes": 30}, timeout=30)
        assert r.status_code == 200, r.text
        me2 = requests.get(f"{API}/auth/me", headers=student_hdr).json()["user"]
        assert me2["xp"] >= me1["xp"] + 20  # +25 XP

    def test_achievements(self, student_hdr):
        r = requests.get(f"{API}/gamification/achievements", headers=student_hdr, timeout=30)
        assert r.status_code == 200
        assert "achievements" in r.json() or isinstance(r.json(), (list, dict))

    def test_leaderboard(self, student_hdr):
        r = requests.get(f"{API}/gamification/leaderboard", headers=student_hdr, timeout=30)
        assert r.status_code == 200


# ---------- Courses ----------
class TestCourses:
    def test_list_courses(self, student_hdr):
        r = requests.get(f"{API}/courses", headers=student_hdr, timeout=30)
        assert r.status_code == 200
        courses = r.json().get("courses", [])
        assert len(courses) > 0
        pytest.course_id = courses[0].get("_id") or courses[0].get("id")
        pytest.course_topic = (courses[0].get("topics") or [{}])[0]

    def test_enroll(self, student_hdr):
        cid = pytest.course_id
        r = requests.post(f"{API}/courses/{cid}/enroll", headers=student_hdr, timeout=30)
        assert r.status_code in (200, 201), r.text

    def test_complete_topic(self, student_hdr):
        cid = pytest.course_id
        t = pytest.course_topic
        tid = t.get("_id") or t.get("id")
        if not tid:
            pytest.skip("No topic id")
        r = requests.post(f"{API}/courses/{cid}/topic/{tid}/complete", headers=student_hdr, timeout=30)
        assert r.status_code == 200, r.text


# ---------- AI offline mode ----------
class TestAIOffline:
    def test_status_not_configured(self, student_hdr):
        r = requests.get(f"{API}/ai/status", headers=student_hdr, timeout=30)
        assert r.status_code == 200
        assert r.json().get("configured") is False

    def test_tutor_fallback(self, student_hdr):
        r = requests.post(f"{API}/ai/tutor", headers=student_hdr,
                          json={"message": "Explain recursion"}, timeout=60)
        assert r.status_code == 200, r.text
        j = r.json()
        assert j.get("configured") is False
        assert j.get("reply") or j.get("message") or j.get("content")

    def test_roadmap_persist(self, student_hdr):
        r = requests.post(f"{API}/ai/roadmap", headers=student_hdr,
                          json={"track": "mern", "goal": "Become full stack"}, timeout=60)
        assert r.status_code == 200, r.text
        rid = (r.json().get("roadmap") or {}).get("_id")
        assert rid, r.text
        lst = requests.get(f"{API}/ai/roadmaps", headers=student_hdr, timeout=30).json()
        assert any((x.get("_id") == rid) for x in lst.get("roadmaps", []))

    def test_quiz_generate(self, student_hdr):
        r = requests.post(f"{API}/ai/quiz", headers=student_hdr,
                          json={"topic": "JavaScript", "count": 5}, timeout=60)
        assert r.status_code == 200, r.text
        q = r.json().get("quiz") or r.json()
        pytest.quiz_id = q.get("_id") or q.get("id")
        assert pytest.quiz_id

    def test_flashcards_generate(self, student_hdr):
        r = requests.post(f"{API}/ai/flashcards", headers=student_hdr,
                          json={"topic": "HTTP", "count": 5}, timeout=60)
        assert r.status_code == 200, r.text

    def test_study_plan_generate(self, student_hdr):
        r = requests.post(f"{API}/ai/study-plan", headers=student_hdr,
                          json={"goal": "Learn React", "days": 7}, timeout=60)
        assert r.status_code == 200, r.text

    def test_resume_analysis(self, student_hdr):
        r = requests.post(f"{API}/ai/resume-analysis", headers=student_hdr,
                          json={"resumeText": "John Doe - SWE with 3y React/Node experience. Skills: JS, React, Node. Led team of 4."}, timeout=60)
        assert r.status_code == 200, r.text

    def test_interview_questions(self, student_hdr):
        r = requests.post(f"{API}/ai/interview/questions", headers=student_hdr,
                          json={"role": "SWE", "type": "technical"}, timeout=60)
        assert r.status_code == 200, r.text

    def test_interview_feedback(self, student_hdr):
        r = requests.post(f"{API}/ai/interview/feedback", headers=student_hdr,
                          json={"question": "What is closure?", "answer": "A function with scope"}, timeout=60)
        assert r.status_code == 200, r.text

    def test_doc_qa(self, student_hdr):
        r = requests.post(f"{API}/ai/doc-qa", headers=student_hdr,
                          json={"docText": "REST is a style of API using HTTP verbs.", "question": "What is REST?"}, timeout=60)
        assert r.status_code == 200, r.text


# ---------- Quizzes ----------
class TestQuizzes:
    def test_submit_quiz(self, student_hdr):
        qid = getattr(pytest, "quiz_id", None)
        if not qid:
            pytest.skip("no quiz")
        q = requests.get(f"{API}/quizzes/{qid}", headers=student_hdr, timeout=30).json().get("quiz") or {}
        answers = [0] * len(q.get("questions", []))
        r = requests.post(f"{API}/quizzes/{qid}/submit", headers=student_hdr,
                          json={"answers": answers}, timeout=30)
        assert r.status_code == 200, r.text
        j = r.json()
        assert "score" in j and "total" in j


# ---------- Flashcards spaced repetition ----------
class TestFlashcards:
    def test_due_and_review(self, student_hdr):
        r = requests.get(f"{API}/flashcards/due", headers=student_hdr, timeout=30)
        assert r.status_code == 200
        cards = r.json().get("cards") or r.json().get("flashcards") or []
        if not cards:
            pytest.skip("no due cards")
        cid = cards[0].get("_id") or cards[0].get("id")
        r2 = requests.post(f"{API}/flashcards/{cid}/review", headers=student_hdr,
                           json={"correct": True}, timeout=30)
        assert r2.status_code == 200, r2.text


# ---------- Study Planner ----------
class TestStudyPlanner:
    def test_generate_and_toggle(self, student_hdr):
        r = requests.post(f"{API}/ai/study-plan", headers=student_hdr,
                          json={"goal": "TEST plan", "days": 3, "track": "mern"}, timeout=60)
        assert r.status_code == 200, r.text
        plan = r.json().get("plan")
        pid = plan.get("_id")
        days = plan.get("days") or []
        if not (pid and days and days[0].get("tasks")):
            pytest.skip("plan missing tasks")
        r2 = requests.put(f"{API}/study-plans/{pid}/task", headers=student_hdr,
                          json={"dayIndex": 0, "taskIndex": 0, "done": True}, timeout=30)
        assert r2.status_code == 200, r2.text


# ---------- Content endpoints ----------
@pytest.mark.parametrize("path,key", [
    ("/content/tracks", "tracks"),
    ("/content/dsa/sheets", "sheets"),
    ("/content/dsa/problems", "problems"),
    ("/content/system-design", "topics"),
    ("/content/placement/companies", "companies"),
    ("/content/aptitude", "categories"),
    ("/content/quickrev", "resources"),
    ("/content/future-path", "paths"),
])
def test_content_endpoints(path, key, student_hdr):
    r = requests.get(f"{API}{path}", headers=student_hdr, timeout=30)
    assert r.status_code == 200, r.text
    assert key in r.json(), f"missing {key} in {path}"


def test_track_detail(student_hdr):
    tracks = requests.get(f"{API}/content/tracks", headers=student_hdr, timeout=30).json().get("tracks", [])
    if not tracks:
        pytest.skip()
    slug = tracks[0].get("slug")
    r = requests.get(f"{API}/content/tracks/{slug}", headers=student_hdr, timeout=30)
    assert r.status_code == 200


# ---------- Premium ----------
class TestPremium:
    def test_list_and_purchase(self):
        # Fresh user to guarantee no prior purchases.
        email = f"TEST_prem_{uuid.uuid4().hex[:8]}@ex.com"
        r0 = requests.post(f"{API}/auth/register", json={"name": "Prem", "email": email, "password": "Passw0rd!", "role": "student"}, timeout=30)
        assert r0.status_code in (200, 201), r0.text
        hdr = {"Authorization": f"Bearer {r0.json()['token']}"}
        r = requests.get(f"{API}/premium", headers=hdr, timeout=30)
        assert r.status_code == 200
        items = r.json().get("items") or []
        assert items, "no premium items"
        # All items should be locked and have protectedContent hidden
        for it in items:
            assert not it.get("unlocked"), f"item {it.get('_id')} unexpectedly unlocked for new user"
            assert "protectedContent" not in it, f"protectedContent leaked for locked item {it.get('_id')}"
        pid = items[0]["_id"]
        pre = requests.get(f"{API}/premium/{pid}/content", headers=hdr, timeout=30)
        assert pre.status_code == 403, f"expected 403, got {pre.status_code}"
        buy = requests.post(f"{API}/premium/{pid}/purchase", headers=hdr, timeout=30)
        assert buy.status_code in (200, 201), buy.text
        post = requests.get(f"{API}/premium/{pid}/content", headers=hdr, timeout=30)
        assert post.status_code == 200, post.text
        assert post.json().get("content"), "protected content missing after purchase"


# ---------- Instructor (RBAC) ----------
class TestInstructorRBAC:
    def test_student_forbidden(self, student_hdr):
        r = requests.get(f"{API}/instructor/dashboard", headers=student_hdr, timeout=30)
        assert r.status_code == 403, f"expected 403, got {r.status_code}"

    def test_teacher_dashboard(self, teacher_hdr):
        r = requests.get(f"{API}/instructor/dashboard", headers=teacher_hdr, timeout=30)
        assert r.status_code == 200, r.text

    def test_teacher_create_course_and_topic(self, teacher_hdr):
        r = requests.post(f"{API}/instructor/courses", headers=teacher_hdr,
                          json={"title": f"TEST Course {uuid.uuid4().hex[:6]}", "description": "test", "level": "Beginner"}, timeout=30)
        assert r.status_code in (200, 201), r.text
        c = r.json().get("course") or r.json()
        cid = c.get("_id") or c.get("id")
        assert cid
        r2 = requests.post(f"{API}/instructor/courses/{cid}/topics", headers=teacher_hdr,
                           json={"title": "TEST Topic", "content": "test content"}, timeout=30)
        assert r2.status_code in (200, 201), r2.text


# ---------- Resumes ----------
class TestResumes:
    def test_create_and_get(self, student_hdr):
        r = requests.post(f"{API}/resumes", headers=student_hdr,
                          json={"title": f"TEST Resume {uuid.uuid4().hex[:6]}",
                                "template": "modern",
                                "data": {"summary": "SWE", "skills": ["JS", "React"]}}, timeout=30)
        assert r.status_code in (200, 201), r.text
        rid = (r.json().get("resume") or r.json()).get("_id")
        assert rid
        g = requests.get(f"{API}/resumes/{rid}", headers=student_hdr, timeout=30)
        assert g.status_code == 200


# ---------- Resources ----------
class TestResources:
    def test_create_and_delete(self, student_hdr):
        r = requests.post(f"{API}/resources", headers=student_hdr,
                          json={"title": "TEST res", "url": "https://ex.com", "type": "link"}, timeout=30)
        assert r.status_code in (200, 201), r.text
        rid = (r.json().get("resource") or r.json()).get("_id")
        assert rid
        d = requests.delete(f"{API}/resources/{rid}", headers=student_hdr, timeout=30)
        assert d.status_code in (200, 204)


# ---------- Search ----------
def test_search(student_hdr):
    r = requests.get(f"{API}/search", headers=student_hdr, params={"q": "react"}, timeout=30)
    assert r.status_code == 200
    assert "results" in r.json() or isinstance(r.json(), dict)
