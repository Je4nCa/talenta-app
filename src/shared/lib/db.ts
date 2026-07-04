import Dexie, { type EntityTable } from 'dexie'
import type { UserProfile } from '@/shared/types/user'

class TalentaDB extends Dexie {
  users!: EntityTable<UserProfile, 'uid'>

  constructor() {
    super('talenta-db')
    this.version(1).stores({
      users: 'uid, email',
    })
  }
}

export const db = new TalentaDB()
