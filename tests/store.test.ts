import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../src/lib/store';

describe('useAppStore', () => {
  beforeEach(() => {
    useAppStore.setState({
      users: {},
      currentUserUid: null,
      progress: {},
      quizHistory: {},
      rewardUnlocks: {},
      landingTheme: 'default',
      isReady: false
    });
  });

  it('should initialize correctly', () => {
    const state = useAppStore.getState();
    expect(state.currentUserUid).toBeNull();
    expect(state.isReady).toBe(false);
  });

  it('should login a new user and set currentUserUid', () => {
    useAppStore.getState().login('user1', 'Test User');
    const state = useAppStore.getState();
    expect(state.currentUserUid).toBe('user1');
    expect(state.users['user1']).toBeDefined();
    expect(state.users['user1'].name).toBe('Test User');
  });

  it('should update progress points correctly', () => {
    useAppStore.getState().login('user1', 'Test User');
    useAppStore.getState().updateProgress('hijaiyah', 'alif', 10);
    
    const state = useAppStore.getState();
    const prog = state.progress['user1']['hijaiyah'];
    expect(prog.points).toBe(10);
    expect(prog.completedItems).toContain('alif');
  });

  it('should unlock GameZone properly upon quiz completion', () => {
    useAppStore.getState().login('user1', 'Test User');
    const result = useAppStore.getState().completeQuizSession('hijaiyah', 10, 10, 0); // 100%
    
    expect(result.scorePercent).toBe(100);
    expect(result.rewardMinutes).toBe(45);

    const status = useAppStore.getState().getGameZoneStatus();
    expect(status).not.toBeNull();
    expect(status?.unlocked).toBe(true);
    expect(status?.rewardMinutes).toBe(45);
  });

  it('should lock GameZone if clock manipulation is detected', () => {
    useAppStore.getState().login('user1', 'Test User');
    useAppStore.getState().unlockGameZone(15, 'manual', 'Test unlock');
    
    // Simulate time passing beyond unlockUntil
    const state = useAppStore.getState();
    const originalStatus = state.rewardUnlocks['user1'];
    expect(originalStatus.unlocked).toBe(true);

    // Mock Date.now to be in the past (manipulation)
    const originalDateNow = Date.now;
    Date.now = () => originalStatus.startAt - 5000; 

    const maliciousStatus = useAppStore.getState().getGameZoneStatus();
    expect(maliciousStatus?.unlocked).toBe(false);
    expect(maliciousStatus?.reason).toBe('Manipulasi jam terdeteksi');

    // Restore Date.now
    Date.now = originalDateNow;
  });
});
