import { Event, Registration } from '../types';

class DatabaseService {
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'techfest_db';
  private readonly EVENTS_STORE = 'events';
  private readonly REGISTRATIONS_STORE = 'registrations';
  private readonly VERSION = 2;

  constructor() {
    this.initDB();
  }

  private initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.VERSION);

      request.onerror = () => reject(request.error);

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(this.EVENTS_STORE)) {
          db.createObjectStore(this.EVENTS_STORE, { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains(this.REGISTRATIONS_STORE)) {
          const registrationStore = db.createObjectStore(this.REGISTRATIONS_STORE, { keyPath: 'id' });
          registrationStore.createIndex('eventId', 'eventId', { unique: false });
        }
      };
    });
  }

  private async ensureDB(): Promise<void> {
    if (!this.db) {
      await this.initDB();
    }
  }

  // Event-related methods
  async getAllEvents(): Promise<Event[]> {
    await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.EVENTS_STORE], 'readonly');
      const store = transaction.objectStore(this.EVENTS_STORE);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getEventById(id: string): Promise<Event | null> {
    await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.EVENTS_STORE], 'readonly');
      const store = transaction.objectStore(this.EVENTS_STORE);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async createEvent(event: Event): Promise<void> {
    await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.EVENTS_STORE], 'readwrite');
      const store = transaction.objectStore(this.EVENTS_STORE);
      const request = store.add(event);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async updateEvent(event: Event): Promise<void> {
    await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.EVENTS_STORE], 'readwrite');
      const store = transaction.objectStore(this.EVENTS_STORE);
      const request = store.put(event);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteEvent(id: string): Promise<void> {
    await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.EVENTS_STORE], 'readwrite');
      const store = transaction.objectStore(this.EVENTS_STORE);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Registration-related methods
  async createRegistration(registration: Registration): Promise<void> {
    await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.REGISTRATIONS_STORE], 'readwrite');
      const store = transaction.objectStore(this.REGISTRATIONS_STORE);
      const request = store.add(registration);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getRegistrationById(id: string): Promise<Registration | null> {
    await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.REGISTRATIONS_STORE], 'readonly');
      const store = transaction.objectStore(this.REGISTRATIONS_STORE);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getRegistrationsByEvent(eventId: string): Promise<Registration[]> {
    await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.REGISTRATIONS_STORE], 'readonly');
      const store = transaction.objectStore(this.REGISTRATIONS_STORE);
      const index = store.index('eventId');
      const request = index.getAll(eventId);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async updateRegistrationStatus(id: string, status: Registration['status']): Promise<void> {
    await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.REGISTRATIONS_STORE], 'readwrite');
      const store = transaction.objectStore(this.REGISTRATIONS_STORE);
      
      const getRequest = store.get(id);
      
      getRequest.onsuccess = () => {
        const registration = getRequest.result;
        if (registration) {
          registration.status = status;
          const updateRequest = store.put(registration);
          updateRequest.onsuccess = () => resolve();
          updateRequest.onerror = () => reject(updateRequest.error);
        } else {
          reject(new Error('Registration not found'));
        }
      };
      
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async getAllRegistrations(): Promise<Registration[]> {
    await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.REGISTRATIONS_STORE], 'readonly');
      const store = transaction.objectStore(this.REGISTRATIONS_STORE);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async initializeDefaultEvents(events: Event[]): Promise<void> {
    await this.ensureDB();
    const currentEvents = await this.getAllEvents();
    if (currentEvents.length === 0) {
      const transaction = this.db!.transaction([this.EVENTS_STORE], 'readwrite');
      const store = transaction.objectStore(this.EVENTS_STORE);
      
      return new Promise((resolve, reject) => {
        let completed = 0;
        events.forEach(event => {
          const request = store.add(event);
          request.onsuccess = () => {
            completed++;
            if (completed === events.length) {
              resolve();
            }
          };
          request.onerror = () => reject(request.error);
        });
      });
    }
  }
}

export const databaseService = new DatabaseService(); 