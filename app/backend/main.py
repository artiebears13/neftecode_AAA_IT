import os
import pandas as pd
import numpy as np
import io
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


def process_csv(input_csv):
    df_bytes = io.BytesIO(input_csv.file.file.read())
    df = pd.read_csv(df_bytes)
    # тут модель

    path = 'backend/tmp/example.csv'
    output_csv = io.BytesIO()
    df.to_csv(output_csv, index=False)
    output_csv.seek(0)

    return output_csv



@app.post("/upload")
async def upload_file(files: list[UploadFile] = File(...), doctype: str = Form(...)):
    path = 'backend/example/example.csv'
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

