import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { v4 as uuidv4 } from 'uuid';

// Collection references
const assessmentsRef = collection(db, 'assessments');
const milestonesRef = collection(db, 'milestones');
const articlesRef = collection(db, 'articles');

// Save a new assessment
export const saveAssessment = async (assessmentData, userId) => {
  try {
    const assessmentToSave = {
      ...assessmentData,
      userId: userId || 'anonymous',
      createdAt: serverTimestamp(),
      id: uuidv4()
    };
    
    const docRef = await addDoc(assessmentsRef, assessmentToSave);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error saving assessment:', error);
    return { success: false, error: error.message };
  }
};

// Get all assessments for a user
export const getUserAssessments = async (userId) => {
  try {
    const q = query(
      assessmentsRef, 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const assessments = [];
    
    querySnapshot.forEach((doc) => {
      assessments.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, assessments };
  } catch (error) {
    console.error('Error fetching user assessments:', error);
    return { success: false, error: error.message };
  }
};

// Get a specific assessment by ID
export const getAssessmentById = async (assessmentId) => {
  try {
    const docRef = doc(db, 'assessments', assessmentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { success: true, assessment: { id: docSnap.id, ...docSnap.data() } };
    } else {
      return { success: false, error: 'Assessment not found' };
    }
  } catch (error) {
    console.error('Error fetching assessment:', error);
    return { success: false, error: error.message };
  }
};

// Get historical assessment data for trend analysis
export const getHistoricalData = async (limit = 50) => {
  try {
    const q = query(
      assessmentsRef,
      where('isPublic', '==', true),
      orderBy('createdAt', 'desc'),
      limit(limit)
    );
    
    const querySnapshot = await getDocs(q);
    const assessments = [];
    
    querySnapshot.forEach((doc) => {
      assessments.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, assessments };
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return { success: false, error: error.message };
  }
};

// Get community average scores for each dimension
export const getCommunityAverages = async () => {
  try {
    const q = query(
      assessmentsRef,
      where('isPublic', '==', true),
      orderBy('createdAt', 'desc'),
      limit(100)
    );
    
    const querySnapshot = await getDocs(q);
    const assessments = [];
    
    querySnapshot.forEach((doc) => {
      assessments.push(doc.data());
    });
    
    // Calculate averages for each dimension
    const dimensions = [
      'Benchmark Performance',
      'Transfer Learning',
      'Reasoning Capabilities',
      'Embodied Intelligence',
      'Social Intelligence'
    ];
    
    const averages = {};
    let totalWeightedScore = 0;
    let totalWeight = 0;
    
    dimensions.forEach(dimension => {
      const scores = assessments
        .filter(a => a.factorScores && a.factorScores[dimension] !== undefined && a.weights && a.weights[dimension] !== undefined)
        .map(a => ({ score: a.factorScores[dimension], weight: a.weights[dimension] }));
      
      if (scores.length > 0) {
        const sum = scores.reduce((acc, curr) => acc + curr.score, 0);
        averages[dimension] = sum / scores.length;
        
        // Calculate weighted total
        const weightedSum = scores.reduce((acc, curr) => acc + (curr.score * curr.weight), 0);
        const totalDimWeight = scores.reduce((acc, curr) => acc + curr.weight, 0);
        
        totalWeightedScore += weightedSum;
        totalWeight += totalDimWeight;
      } else {
        averages[dimension] = 0;
      }
    });
    
    // Calculate overall percentage
    const overallPercentage = totalWeight > 0 ? (totalWeightedScore / totalWeight) : 0;
    
    return { 
      success: true, 
      averages, 
      overallPercentage,
      sampleSize: assessments.length 
    };
  } catch (error) {
    console.error('Error calculating community averages:', error);
    return { success: false, error: error.message };
  }
};

// Save an AI milestone
export const saveMilestone = async (milestoneData) => {
  try {
    const milestoneToSave = {
      ...milestoneData,
      createdAt: serverTimestamp(),
      id: uuidv4()
    };
    
    const docRef = await addDoc(milestonesRef, milestoneToSave);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error saving milestone:', error);
    return { success: false, error: error.message };
  }
};

// Get all milestones
export const getMilestones = async () => {
  try {
    const q = query(milestonesRef, orderBy('date', 'asc'));
    const querySnapshot = await getDocs(q);
    const milestones = [];
    
    querySnapshot.forEach((doc) => {
      milestones.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, milestones };
  } catch (error) {
    console.error('Error fetching milestones:', error);
    return { success: false, error: error.message };
  }
};

// Save a news article with AGI impact assessment
export const saveArticle = async (articleData, userId) => {
  try {
    const articleToSave = {
      ...articleData,
      userId: userId || 'anonymous',
      createdAt: serverTimestamp(),
      votes: 0,
      voters: [],
      id: uuidv4()
    };
    
    const docRef = await addDoc(articlesRef, articleToSave);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error saving article:', error);
    return { success: false, error: error.message };
  }
};

// Get recent articles with their AGI impact assessments
export const getRecentArticles = async (limitCount = 10) => {
  try {
    const q = query(
      articlesRef,
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const articles = [];
    
    querySnapshot.forEach((doc) => {
      articles.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, articles };
  } catch (error) {
    console.error('Error fetching articles:', error);
    return { success: false, error: error.message };
  }
};

// Vote on an article's significance
export const voteOnArticle = async (articleId, userId, vote) => {
  try {
    const docRef = doc(db, 'articles', articleId);
    const articleDoc = await getDoc(docRef);
    
    if (!articleDoc.exists()) {
      return { success: false, error: 'Article not found' };
    }
    
    const articleData = articleDoc.data();
    const voters = articleData.voters || [];
    
    // Check if user already voted
    if (voters.includes(userId)) {
      return { success: false, error: 'User already voted on this article' };
    }
    
    // Update vote count and voters list
    await updateDoc(docRef, {
      votes: articleData.votes + vote,
      voters: [...voters, userId]
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error voting on article:', error);
    return { success: false, error: error.message };
  }
}; 