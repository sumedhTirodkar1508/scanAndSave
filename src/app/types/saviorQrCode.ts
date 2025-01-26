export interface SaviorQRCode {
  id: string;
  createdAt: string;
  name: string | null;
  email: string;
  profileImageUrl: string | null;
  qrCode: {
    id: string;
    victimName: string;
    victimEmail: string;
  };
}
