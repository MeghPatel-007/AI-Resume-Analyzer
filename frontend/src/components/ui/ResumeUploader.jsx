import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Zap,
} from 'lucide-react'
import { useResume } from '../../context/ResumeContext'
import { useNavigate } from 'react-router-dom'
import { formatBytes } from '../../utils/helpers'
import toast from 'react-hot-toast'

const ResumeUploader = () => {
  const {
    uploadStatus,
    uploadProgress,
    uploadError,
    uploadResume,
    resetUpload,
  } = useResume()
  const [selectedFile, setSelectedFile] = useState(null)
  const navigate = useNavigate()

  const handleAnalyze = async () => {
    if (!selectedFile) return

    try {
      const result = await uploadResume(selectedFile)

      resetUpload()
      setSelectedFile(null)

      navigate(`/report/${result.id}`)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        const error = rejectedFiles[0].errors[0]
        if (error.code === 'file-too-large') {
          toast.error('File is too large. Maximum size is 5MB.')
        } else if (error.code === 'file-invalid-type') {
          toast.error('Only PDF files are accepted.')
        } else {
          toast.error('Invalid file. Please upload a PDF.')
        }
        return
      }
      if (acceptedFiles.length > 0) {
        setSelectedFile(acceptedFiles[0])
        resetUpload()
      }
    },
    [resetUpload],
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: { 'application/pdf': ['.pdf'] },
      maxSize: 5 * 1024 * 1024,
      multiple: false,
      disabled: uploadStatus === 'uploading' || uploadStatus === 'processing',
    })

  const handleRemoveFile = () => {
    setSelectedFile(null)
    resetUpload()
  }

  const isLoading =
    uploadStatus === 'uploading' || uploadStatus === 'processing'

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {/* Drop Zone */}
        {!selectedFile && uploadStatus === 'idle' && (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div
              {...getRootProps()}
              className={`
                relative rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer
                transition-all duration-300 outline-none
                ${
                  isDragActive && !isDragReject
                    ? 'border-blue-500 bg-blue-500/10 scale-[1.02]'
                    : isDragReject
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-slate-600 bg-slate-800/30 hover:border-slate-500 hover:bg-slate-800/50'
                }
              `}
            >
              <input {...getInputProps()} aria-label="Upload PDF resume" />

              <motion.div
                animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
                className="flex flex-col items-center"
              >
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-all ${
                    isDragActive
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-slate-700/60 text-slate-400'
                  }`}
                >
                  {isDragReject ? (
                    <AlertCircle className="w-8 h-8 text-red-400" />
                  ) : (
                    <Upload className="w-8 h-8" />
                  )}
                </div>

                {isDragActive && !isDragReject ? (
                  <p className="text-blue-400 font-semibold text-lg">
                    Drop it here!
                  </p>
                ) : isDragReject ? (
                  <p className="text-red-400 font-semibold text-lg">
                    Only PDF files are accepted
                  </p>
                ) : (
                  <>
                    <p className="text-slate-200 font-semibold text-lg mb-2">
                      Drop your resume here
                    </p>
                    <p className="text-slate-400 text-sm mb-4">
                      or{' '}
                      <span className="text-blue-400 underline underline-offset-2">
                        browse files
                      </span>
                    </p>
                    <p className="text-slate-500 text-xs">
                      PDF only · Max 5MB · No sign-up required
                    </p>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* File Selected */}
        {selectedFile && (
          <motion.div
            key="file-selected"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* File preview */}
            <div className="card p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white text-sm truncate">
                  {selectedFile.name}
                </p>
                <p className="text-slate-400 text-xs mt-0.5">
                  {formatBytes(selectedFile.size)} · PDF
                </p>
              </div>
              {!isLoading && (
                <button
                  onClick={handleRemoveFile}
                  className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                  aria-label="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Progress bar */}
            {isLoading && (
              <div className="card p-5 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                    {uploadStatus === 'uploading'
                      ? 'Uploading...'
                      : 'Analyzing resume...'}
                  </span>
                  <span className="text-blue-400 font-semibold">
                    {uploadProgress}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-slate-400 text-xs">
                  {uploadStatus === 'processing'
                    ? 'Extracting skills, experience, and calculating ATS score...'
                    : 'Securely transmitting your resume...'}
                </p>
              </div>
            )}

            {/* Error */}
            {uploadStatus === 'error' && uploadError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30"
              >
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-300 text-sm font-medium">
                    Analysis failed
                  </p>
                  <p className="text-red-400/70 text-xs mt-0.5">
                    {uploadError}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Action button */}
            {!isLoading && (
              <button
                onClick={handleAnalyze}
                className="btn-primary w-full py-3.5 text-base"
                disabled={isLoading}
              >
                <Zap className="w-5 h-5" />
                {uploadStatus === 'error' ? 'Try Again' : 'Analyze Resume'}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ResumeUploader
