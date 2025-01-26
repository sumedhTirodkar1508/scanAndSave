export interface QrRequest {
  id: string;
  userId: string;
  victimName: string;
  victimEmail: string;
  relativeName: string;
  relativePhone: string;
  relativeEmail: string;
  bloodGroup: string;
  sickness: string;
  medication: string;
  status: string;
  qrCodeUrl: string | null; // Nullable because `qrCodeUrl` can be null
  createdAt: string;
}
