import multer from 'multer';

const storage = multer.memoryStorage(); 

const upload = multer({
  storage: storage,
  limits: {
    // Define um limite máximo para o tamanho do arquivo (ex: 5MB)
    fileSize: 5 * 1024 * 1024, 
  },

});

export default upload;