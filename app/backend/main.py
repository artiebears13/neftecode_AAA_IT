import os
import pandas as pd
import numpy as np
import io
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, APIRouter, Response
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import csv

from fastapi.responses import StreamingResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["localhost", "*"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

def model(data: pd.DataFrame) -> pd.DataFrame:
    return data

@app.post("/upload")
async def upload_file(files: list[UploadFile] = File(...), doctype: str = Form(...)):
    try:
        df_bytes = io.BytesIO(files[0].file.read())
        df = pd.read_csv(df_bytes,)
        df = model(df)

        df.rename(columns={df.columns[0]:df.columns[0]+','}, inplace=True)
        df.iloc[:, 0] = df.iloc[:, 0].astype(str) + ','
        output = io.StringIO()
        df.to_string(output, index=False,)

        return StreamingResponse(output.getvalue(), media_type="text/csv",)
    except Exception as e:
        raise HTTPException(status_code=500, detail={'error': str(e)})