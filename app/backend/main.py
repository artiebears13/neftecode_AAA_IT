import os
import shutil
import json
import shutil

import pandas as pd
import aiofiles
import zipfile
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, APIRouter
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["localhost", "*"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)



@app.post("/upload")
async def upload_file(files: list[UploadFile] = File(...), doctype: str = Form(...)):
    path = 'backend/tmp/example.csv'
    print(os.path.exists(f'{path}'))
    if os.path.exists(f'{path}'):
        return FileResponse(f'{path}')
    else:
        raise HTTPException(status_code=500, detail="File not found")


# @app.post("/handle_example")
# async def handle_example(request: dict):
#
#     else:
#         return JSONResponse(content={"message": "Failed to upload files", "error": "wrong format"}, status_code=500)
#
#     return JSONResponse(content=res, status_code=200)

