import { X } from 'lucide-react';
import type { BadgeReward, GemTransaction } from '../services/api';

interface GemsPanelProps {
  open: boolean;
  totalGems: number;
  badges: BadgeReward[];
  transactions: GemTransaction[];
  loading: boolean;
  onClose: () => void;
}

function badgeName(badge: BadgeReward) {
  return badge.badge_name ?? badge.badgeName ?? 'Badge';
}

function badgeEmoji(badge: BadgeReward) {
  return badge.badge_emoji ?? badge.badgeEmoji ?? '🏅';
}

function txGems(tx: GemTransaction) {
  return tx.gems_earned ?? tx.gemsEarned ?? 0;
}

function txDate(tx: GemTransaction) {
  const value = tx.created_at ?? tx.createdAt;
  return value ? new Date(value).toLocaleDateString() : 'Today';
}

function levelName(totalGems: number) {
  if (totalGems >= 500) return 'Diamond';
  if (totalGems >= 300) return 'Platinum';
  if (totalGems >= 200) return 'Gold';
  if (totalGems >= 100) return 'Silver';
  return 'Bronze';
}

export function GemsPanel({ open, totalGems, badges, transactions, loading, onClose }: GemsPanelProps) {
  const nextLevel = Math.ceil((totalGems + 1) / 100) * 100;
  const progress = Math.min(100, totalGems % 100);

  return (
    <div className={`gems-panel ${open ? 'gems-panel--open' : ''}`} aria-hidden={!open}>
      <div className="gems-panel__header">
        <div>
          <p>Rewards</p>
          <h2>💎 {totalGems} gems</h2>
        </div>
        <button type="button" className="icon-btn" onClick={onClose} title="Close rewards">
          <X size={18} />
        </button>
      </div>

      {loading ? (
        <p className="gems-panel__loading">Loading rewards...</p>
      ) : (
        <>
          <div className="gems-panel__level">
            <strong>{levelName(totalGems)} Learner</strong>
            <span>{nextLevel - totalGems} gems to next level</span>
            <div className="gems-panel__bar">
              <i style={{ width: `${progress}%` }} />
            </div>
          </div>

          <section>
            <h3>Badges</h3>
            <div className="badge-grid">
              {badges.length ? badges.map((badge) => (
                <div className="reward-badge" key={badge.id}>
                  <span>{badgeEmoji(badge)}</span>
                  <strong>{badgeName(badge)}</strong>
                </div>
              )) : <p className="text-muted">No badges yet. Log in daily and finish courses.</p>}
            </div>
          </section>

          <section>
            <h3>Recent gems</h3>
            <div className="transaction-list">
              {transactions.slice(0, 10).map((tx) => (
                <div className="transaction-item" key={tx.id}>
                  <span>+{txGems(tx)} 💎</span>
                  <strong>{tx.reason}</strong>
                  <small>{txDate(tx)}</small>
                </div>
              ))}
              {!transactions.length && <p className="text-muted">No gem activity yet.</p>}
            </div>
          </section>

          <div className="leaderboard-teaser">Leaderboard unlocks as more learners earn gems.</div>
        </>
      )}
    </div>
  );
}
