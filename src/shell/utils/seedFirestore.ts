import { collection, doc, writeBatch } from 'firebase/firestore';
import { db } from '@shell/firebase';
import { INITIAL_PROJECTS, INITIAL_RESEARCH_POSTS, INITIAL_TIMELINE } from '@core/initialData';

export async function seedFirestore() {
  try {
    const batch = writeBatch(db);

    // Seed projects
    INITIAL_PROJECTS.forEach((project) => {
      const docRef = doc(db, 'projects', project.id);
      batch.set(docRef, project);
    });

    // Seed research posts
    INITIAL_RESEARCH_POSTS.forEach((post) => {
      const docRef = doc(db, 'research', post.id);
      batch.set(docRef, post);
    });

    // Seed timeline
    INITIAL_TIMELINE.forEach((item) => {
      const docRef = doc(db, 'timeline', item.version);
      batch.set(docRef, item);
    });

    await batch.commit();
    console.log('✅ Firestore seeded successfully!');
    return { success: true, message: 'Firestore seeded successfully!' };
  } catch (error) {
    console.error('❌ Error seeding Firestore:', error);
    return { success: false, message: 'Failed to seed Firestore', error };
  }
}
