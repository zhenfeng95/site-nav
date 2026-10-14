export type SubmissionStatus = 'pending' | 'approved' | 'rejected'

export interface Submission {
  id: string
  name: string
  url: string
  category: string
  description: string
  contact: string
  iconUrl: string
  status: SubmissionStatus
  note: string
  createdAt: string
  updatedAt: string
}

export interface SubmissionCreateInput {
  name: string
  url: string
  category: string
  description?: string
  contact?: string
  iconUrl?: string
  captcha?: string
  /** Honeypot — must be empty */
  website?: string
}
