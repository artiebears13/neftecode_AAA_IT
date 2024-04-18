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
from .model import SemanticModel
from .parser_file import ParserFile, ParserZip
from fastapi.responses import FileResponse

model_ = SemanticModel()
parser = ParserFile()
parser_zip = ParserZip()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["localhost", "*"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)




@app.post("/upload")
async def upload_files(files: list[UploadFile] = File(...), doctype: str = Form(...)):
    try

        return JSONResponse(content=resp, status_code=200)
    except Exception as e:
        print(e)
        return JSONResponse(content={"message": "Failed to upload files", "error": str(e)}, status_code=500)


@app.post("/handle_example")
async def handle_example(request: dict):

    else:
        return JSONResponse(content={"message": "Failed to upload files", "error": "wrong format"}, status_code=500)

    return JSONResponse(content=res, status_code=200)

