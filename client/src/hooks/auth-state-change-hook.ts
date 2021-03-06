import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { auth, createUserProfileDocument } from '../firebase/firebase-utils'

import { addUserAction } from '../redux/user/actions'

import { User } from '../types/types'

export const useFirebaseAuth = () => {

    const dispatch = useDispatch()

    useEffect(() => {
        const unSubscribeListenerForAuth = auth.onAuthStateChanged(async userAuth => {
            if (userAuth != null) {
                const userRef = await createUserProfileDocument(userAuth)

                userRef.onSnapshot(snapshot => {

                    const user: User = {
                        id: snapshot.id,
                        createdAt: snapshot.data()?.createdAt.toDate(),
                        displayName: snapshot.data()?.displayName,
                        email: snapshot.data()?.email
                    }

                    dispatch(addUserAction(user))
                })
            } else {
                dispatch(addUserAction(null))
            }
        })

        return () => {
            unSubscribeListenerForAuth()
        }
    }, [])

}