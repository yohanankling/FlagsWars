import { AuthProvider, signInWithPopup, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword} from 'firebase/auth'
import { auth } from '../firebase/firebase'


const registerManualy = async (email: string, name: string, password: string) => {
    try {
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredentials.user, { displayName: name });
        console.log('Register Successfully')
        console.log(userCredentials)
    } catch (error) {
        console.log('Register Failed')
        console.warn(error)
        throw error;
    }
}
const registerWithProvider = async (provider: AuthProvider) => {
    try {
        const userCredentials = await signInWithPopup(auth, provider)
        console.log('Register Successfully')
        console.log(userCredentials)
    } catch (error) {
        console.log('Register Failed')
        console.warn(error)
    }
}

const signInWithProvider = async (provider: any) => {
    try {
        const userCredentials = await signInWithPopup(auth, provider)
        console.log(userCredentials)
    } catch (error) {
        console.warn(error)
    }
}

const signInManualy = async (email: string, password: string) => {
    try {
        const userCredentials = await signInWithEmailAndPassword(auth, email, password)
        console.log(userCredentials)
    } catch (error) {
        console.warn(error)
        throw error;
    }
}

const signOut = async () => {
    await auth.signOut()
}

export default {registerManualy, registerWithProvider, signInWithProvider, signInManualy, signOut }
