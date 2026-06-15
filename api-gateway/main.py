from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import httpx

app = FastAPI(title="Learn Track API Gateway")

# ─── CORS — allow frontend on 5173 to call this gateway ──────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SPRING_BOOT_URL = "http://localhost:8081"

@app.get("/")
def root():
    return {"message": "API Gateway Running!", "status": "ok"}

# ─── AUTH ────────────────────────────────────────────────────

@app.post("/api/auth/login")
async def login(request: Request):
    try:
        body = await request.json()
        if "email" in body and "email_id" not in body:
            body["email_id"] = body["email"]
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{SPRING_BOOT_URL}/api/auth/login",
                json=body,
                timeout=10.0
            )
        return JSONResponse(
            content=response.json(),
            status_code=response.status_code
        )
    except Exception as e:
        return JSONResponse(
            content={"error": str(e)},
            status_code=500
        )

@app.post("/api/auth/register")
async def register(request: Request):
    try:
        body = await request.json()
        if "email" in body and "email_id" not in body:
            body["email_id"] = body["email"]
        if "password_hash" in body and "password" not in body:
            body["password"] = body["password_hash"]
        body["role"] = 3 if body.get("role") in (3, "3", "ADMIN") else 1
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{SPRING_BOOT_URL}/api/auth/register",
                json=body,
                timeout=10.0
            )
        return JSONResponse(
            content=response.json(),
            status_code=response.status_code
        )
    except Exception as e:
        return JSONResponse(
            content={"error": str(e)},
            status_code=500
        )

@app.get("/api/users")
async def get_users(request: Request):
    try:
        headers = {"Authorization": request.headers.get("Authorization", "")}
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SPRING_BOOT_URL}/api/users",
                headers=headers,
                timeout=10.0
            )
        return JSONResponse(content=response.json(), status_code=response.status_code)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

# ─── COURSES ─────────────────────────────────────────────────

@app.get("/api/courses")
async def get_courses(request: Request):
    try:
        headers = {"Authorization": request.headers.get("Authorization", "")}
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SPRING_BOOT_URL}/api/courses",
                headers=headers,
                timeout=10.0
            )
        return JSONResponse(content=response.json(), status_code=response.status_code)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.post("/api/courses")
async def create_course(request: Request):
    try:
        body = await request.json()
        if "title" in body and "course_name" not in body:
            body["course_name"] = body["title"]
        if "total_modules" in body and "duration_hours" not in body:
            body["duration_hours"] = body["total_modules"]
        if "category_id" not in body:
            body["category_id"] = 1
        headers = {"Authorization": request.headers.get("Authorization", "")}
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{SPRING_BOOT_URL}/api/courses",
                json=body,
                headers=headers,
                timeout=10.0
            )
        return JSONResponse(content=response.json(), status_code=response.status_code)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.put("/api/courses/{id}")
async def update_course(id: int, request: Request):
    try:
        body = await request.json()
        if "title" in body and "course_name" not in body:
            body["course_name"] = body["title"]
        if "total_modules" in body and "duration_hours" not in body:
            body["duration_hours"] = body["total_modules"]
        if "category_id" not in body:
            body["category_id"] = 1
        headers = {"Authorization": request.headers.get("Authorization", "")}
        async with httpx.AsyncClient() as client:
            response = await client.put(
                f"{SPRING_BOOT_URL}/api/courses/{id}",
                json=body,
                headers=headers,
                timeout=10.0
            )
        return JSONResponse(content=response.json(), status_code=response.status_code)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.delete("/api/courses/{id}")
async def delete_course(id: int, request: Request):
    try:
        headers = {"Authorization": request.headers.get("Authorization", "")}
        async with httpx.AsyncClient() as client:
            response = await client.delete(
                f"{SPRING_BOOT_URL}/api/courses/{id}",
                headers=headers,
                timeout=10.0
            )
        return JSONResponse(content={"message": "Deleted"}, status_code=response.status_code)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

# ─── PROGRESS ────────────────────────────────────────────────

@app.get("/api/progress/user/{user_id}")
async def get_user_progress(user_id: int, request: Request):
    try:
        headers = {"Authorization": request.headers.get("Authorization", "")}
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SPRING_BOOT_URL}/api/progress/user/{user_id}",
                headers=headers,
                timeout=10.0
            )
        return JSONResponse(content=response.json(), status_code=response.status_code)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.get("/api/progress/all")
async def get_all_progress(request: Request):
    try:
        headers = {"Authorization": request.headers.get("Authorization", "")}
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SPRING_BOOT_URL}/api/progress/all",
                headers=headers,
                timeout=10.0
            )
        return JSONResponse(content=response.json(), status_code=response.status_code)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.post("/api/progress/update")
async def update_progress(request: Request):
    try:
        body = await request.json()
        headers = {"Authorization": request.headers.get("Authorization", "")}
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{SPRING_BOOT_URL}/api/progress/update",
                json=body,
                headers=headers,
                timeout=10.0
            )
        return JSONResponse(content=response.json(), status_code=response.status_code)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.get("/api/progress/not-completed")
async def get_not_completed(request: Request):
    try:
        headers = {"Authorization": request.headers.get("Authorization", "")}
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SPRING_BOOT_URL}/api/progress/not-completed",
                headers=headers,
                timeout=10.0
            )
        return JSONResponse(content=response.json(), status_code=response.status_code)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.get("/api/progress/low-performers")
async def get_low_performers(request: Request):
    try:
        headers = {"Authorization": request.headers.get("Authorization", "")}
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SPRING_BOOT_URL}/api/progress/low-performers",
                headers=headers,
                timeout=10.0
            )
        return JSONResponse(content=response.json(), status_code=response.status_code)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.get("/api/progress/completed-count/{user_id}")
async def get_completed_count(user_id: int, request: Request):
    try:
        headers = {"Authorization": request.headers.get("Authorization", "")}
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SPRING_BOOT_URL}/api/progress/completed-count/{user_id}",
                headers=headers,
                timeout=10.0
            )
        return JSONResponse(content=response.json(), status_code=response.status_code)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.get("/api/authservice/gems/{user_id}")
async def get_user_gems(user_id: int, request: Request):
    try:
        headers = {"Authorization": request.headers.get("Authorization", "")}
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SPRING_BOOT_URL}/authservice/gems/{user_id}",
                headers=headers,
                timeout=10.0
            )
        return JSONResponse(content=response.json(), status_code=response.status_code)
    except Exception as e:
        return JSONResponse(content={"code": 500, "message": str(e)}, status_code=500)

@app.get("/api/authservice/badges/{user_id}")
async def get_user_badges(user_id: int, request: Request):
    try:
        headers = {"Authorization": request.headers.get("Authorization", "")}
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SPRING_BOOT_URL}/authservice/badges/{user_id}",
                headers=headers,
                timeout=10.0
            )
        return JSONResponse(content=response.json(), status_code=response.status_code)
    except Exception as e:
        return JSONResponse(content={"code": 500, "message": str(e)}, status_code=500)

@app.get("/api/authservice/streak/{user_id}")
async def get_user_streak(user_id: int, request: Request):
    try:
        headers = {"Authorization": request.headers.get("Authorization", "")}
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SPRING_BOOT_URL}/authservice/streak/{user_id}",
                headers=headers,
                timeout=10.0
            )
        return JSONResponse(content=response.json(), status_code=response.status_code)
    except Exception as e:
        return JSONResponse(content={"code": 500, "message": str(e)}, status_code=500)

@app.get("/api/courses/{course_id}/modules")
async def get_course_modules(course_id: int, request: Request):
    try:
        headers = {"Authorization": request.headers.get("Authorization", "")}
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{SPRING_BOOT_URL}/api/courses/{course_id}/modules", headers=headers, timeout=10.0)
        return JSONResponse(content=response.json(), status_code=response.status_code)
    except Exception as e:
        return JSONResponse(content={"code": 500, "message": str(e)}, status_code=500)

@app.get("/api/modules/{module_id}")
async def get_module(module_id: int, request: Request):
    try:
        headers = {"Authorization": request.headers.get("Authorization", "")}
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{SPRING_BOOT_URL}/api/modules/{module_id}", headers=headers, timeout=10.0)
        return JSONResponse(content=response.json(), status_code=response.status_code)
    except Exception as e:
        return JSONResponse(content={"code": 500, "message": str(e)}, status_code=500)

@app.post("/api/modules")
async def create_module(request: Request):
    try:
        body = await request.json()
        headers = {"Authorization": request.headers.get("Authorization", "")}
        async with httpx.AsyncClient() as client:
            response = await client.post(f"{SPRING_BOOT_URL}/api/modules", json=body, headers=headers, timeout=10.0)
        return JSONResponse(content=response.json(), status_code=response.status_code)
    except Exception as e:
        return JSONResponse(content={"code": 500, "message": str(e)}, status_code=500)

@app.put("/api/modules/{module_id}")
async def update_module(module_id: int, request: Request):
    try:
        body = await request.json()
        headers = {"Authorization": request.headers.get("Authorization", "")}
        async with httpx.AsyncClient() as client:
            response = await client.put(f"{SPRING_BOOT_URL}/api/modules/{module_id}", json=body, headers=headers, timeout=10.0)
        return JSONResponse(content=response.json(), status_code=response.status_code)
    except Exception as e:
        return JSONResponse(content={"code": 500, "message": str(e)}, status_code=500)

@app.delete("/api/modules/{module_id}")
async def delete_module(module_id: int, request: Request):
    try:
        headers = {"Authorization": request.headers.get("Authorization", "")}
        async with httpx.AsyncClient() as client:
            response = await client.delete(f"{SPRING_BOOT_URL}/api/modules/{module_id}", headers=headers, timeout=10.0)
        return JSONResponse(content={"message": "Deleted"}, status_code=response.status_code)
    except Exception as e:
        return JSONResponse(content={"code": 500, "message": str(e)}, status_code=500)

@app.post("/api/modules/{module_id}/submit")
async def submit_module_pdf(module_id: int, request: Request):
    try:
        user_id = request.query_params.get("userId")
        body = await request.body()
        headers = {
            "Authorization": request.headers.get("Authorization", ""),
            "Content-Type": request.headers.get("Content-Type", ""),
        }
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{SPRING_BOOT_URL}/api/modules/{module_id}/submit",
                params={"userId": user_id},
                content=body,
                headers=headers,
                timeout=60.0
            )
        return JSONResponse(content=response.json(), status_code=response.status_code)
    except Exception as e:
        return JSONResponse(content={"code": 500, "message": str(e)}, status_code=500)

@app.get("/api/submissions")
async def get_submissions(request: Request):
    try:
        headers = {"Authorization": request.headers.get("Authorization", "")}
        params = dict(request.query_params)
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{SPRING_BOOT_URL}/api/submissions", params=params, headers=headers, timeout=10.0)
        return JSONResponse(content=response.json(), status_code=response.status_code)
    except Exception as e:
        return JSONResponse(content={"code": 500, "message": str(e)}, status_code=500)

@app.put("/api/submissions/{submission_id}/review")
async def review_submission(submission_id: int, request: Request):
    try:
        body = await request.json()
        headers = {"Authorization": request.headers.get("Authorization", "")}
        async with httpx.AsyncClient() as client:
            response = await client.put(f"{SPRING_BOOT_URL}/api/submissions/{submission_id}/review", json=body, headers=headers, timeout=10.0)
        return JSONResponse(content=response.json(), status_code=response.status_code)
    except Exception as e:
        return JSONResponse(content={"code": 500, "message": str(e)}, status_code=500)
