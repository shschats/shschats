
'use client'

//wrapper for ion icons due to some odd errors in the console will come back to this
import { IonIcon } from '@ionic/react'

const Icon = ({ icon, ...props }: any) => {
  return <IonIcon role='' class='md' icon={icon} {...props} />
}

export default Icon
