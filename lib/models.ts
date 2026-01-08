import type { ObjectId } from "mongodb"

export interface Influencer {
  _id?: ObjectId
  userId: string
  name: string
  email: string
  phone: string
  instagramLink: string
  location: string
  gender: string
  age: number
  contentCategory: string
  followersCount: number
  language: string
  bankDetails: string
  upiId: string
  profileVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Campaign {
  _id?: ObjectId
  brandId: string
  brandName: string
  brandLogo: string
  collaborationType: string
  deadline: Date
  paymentAmount: number
  paymentStatus: string
  referenceVideoUrl: string
  description: string
  requirements: string
  status: "active" | "completed" | "cancelled"
  createdAt: Date
  updatedAt: Date
}

export interface Application {
  _id?: ObjectId
  campaignId: string
  influencerId: string
  influencerName: string
  influencerEmail: string
  status: "Applied" | "Under Review" | "Approved" | "Rejected" | "Submitted"
  appliedAt: Date
  reviewedAt?: Date
  approvedAt?: Date
  rejectionReason?: string
  submittedAt?: Date
}

export interface Submission {
  _id?: ObjectId
  applicationId: string
  campaignId: string
  influencerId: string
  contentLinks: string[]
  videoUrl?: string
  submittedAt: Date
  reviewStatus: "pending" | "approved" | "rejected"
  adminNotes?: string
  updatedAt: Date
}

export interface PaymentRecord {
  _id?: ObjectId
  campaignId: string
  influencerId: string
  influencerEmail: string
  amount: number
  status: "Pending" | "Completed"
  upiId: string
  bankDetails: string
  createdAt: Date
  updatedAt: Date
}

export interface User {
  _id?: ObjectId
  email: string
  password: string
  role: "influencer" | "admin" | "brand"
  createdAt: Date
}

export interface Brand {
  _id?: ObjectId
  userId: string
  email: string
  companyName: string
  companyLogo: string
  industry: string
  website: string
  phone: string
  location: string
  description: string
  verificationStatus: "pending" | "verified" | "rejected"
  walletBalance: number
  totalCampaigns: number
  createdAt: Date
  updatedAt: Date
}

export interface Message {
  _id?: ObjectId
  conversationId: string
  senderId: string
  senderRole: "influencer" | "brand"
  recipientId: string
  content: string
  attachments?: string[]
  read: boolean
  createdAt: Date
}

export interface Conversation {
  _id?: ObjectId
  campaignId: string
  influencerId: string
  brandId: string
  influencerName: string
  brandName: string
  lastMessage: string
  lastMessageAt: Date
  participantIds: string[]
  createdAt: Date
  updatedAt: Date
}

export interface WithdrawalRequest {
  _id?: ObjectId
  influencerId: string
  influencerEmail: string
  amount: number
  status: "pending" | "approved" | "rejected" | "completed"
  paymentMethod: "upi" | "bank"
  upiId?: string
  bankDetails?: string
  requestedAt: Date
  processedAt?: Date
  transactionId?: string
}

export interface InfluencerAnalytics {
  _id?: ObjectId
  influencerId: string
  campaignsParticipated: number
  totalEarnings: number
  completedCampaigns: number
  pendingEarnings: number
  applications: number
  approvalRate: number
  viewCount: number
  engagementRate: number
  lastUpdated: Date
}

export interface CampaignAnalytics {
  _id?: ObjectId
  campaignId: string
  totalApplications: number
  approvedInfluencers: number
  completedSubmissions: number
  totalBudgetSpent: number
  reachEstimate: number
  engagementEstimate: number
  lastUpdated: Date
}
