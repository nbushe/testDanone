import React, { useState } from "react";
import { Button, TextField, Box } from "@mui/material";
import { uploadXmlFile } from "../services/api";

const UploadForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (file) {
      try {
        await uploadXmlFile(file);
        setStatus("XML файл успешно загружен!");
      } catch (error) {
        setStatus("Ошибка при загрузке XML файла.");
      }
    }
  };

  return (
    <Box>
      <TextField type="file" onChange={handleFileChange} />
      <Button onClick={handleSubmit} variant="contained">
        Загрузить XML
      </Button>
      {status && <p>{status}</p>}
    </Box>
  );
};

export default UploadForm;