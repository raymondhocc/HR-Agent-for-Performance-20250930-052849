import { DurableObject } from 'cloudflare:workers';
import type { Candidate, CandidateStatus } from './types';
import type { Env } from './core-utils';
export class AppController extends DurableObject<Env> {
  private candidates = new Map<string, Candidate>();
  private loaded = false;
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
  }
  private async ensureLoaded(): Promise<void> {
    if (!this.loaded) {
      const stored = await this.ctx.storage.get<Record<string, Candidate>>('candidates') || {};
      this.candidates = new Map(Object.entries(stored));
      this.loaded = true;
    }
  }
  private async persist(): Promise<void> {
    await this.ctx.storage.put('candidates', Object.fromEntries(this.candidates));
  }
  async addCandidate(name: string, position: string): Promise<Candidate> {
    await this.ensureLoaded();
    const now = Date.now();
    const id = crypto.randomUUID();
    const newCandidate: Candidate = {
      id,
      name,
      position,
      avatarUrl: `https://api.dicebear.com/8.x/lorelei/svg?seed=${name.split(' ').join('')}`,
      status: 'Pending Interview',
      createdAt: now,
      lastActive: now,
    };
    this.candidates.set(id, newCandidate);
    await this.persist();
    return newCandidate;
  }
  async removeCandidate(candidateId: string): Promise<boolean> {
    await this.ensureLoaded();
    const deleted = this.candidates.delete(candidateId);
    if (deleted) await this.persist();
    return deleted;
  }
  async updateCandidateStatus(candidateId: string, status: CandidateStatus): Promise<boolean> {
    await this.ensureLoaded();
    const candidate = this.candidates.get(candidateId);
    if (candidate) {
      candidate.status = status;
      candidate.lastActive = Date.now();
      await this.persist();
      return true;
    }
    return false;
  }
  async listCandidates(): Promise<Candidate[]> {
    await this.ensureLoaded();
    return Array.from(this.candidates.values()).sort((a, b) => b.createdAt - a.createdAt);
  }
  async getCandidate(candidateId: string): Promise<Candidate | null> {
    await this.ensureLoaded();
    return this.candidates.get(candidateId) || null;
  }
  async clearAllCandidates(): Promise<number> {
    await this.ensureLoaded();
    const count = this.candidates.size;
    this.candidates.clear();
    await this.persist();
    return count;
  }
}