export interface UserSubscription {
    id: string;
    status: 'active' | 'trialing' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'unpaid';
    plan: 'free' | 'premium';
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
  }