import { useLocation } from "react-router-dom"
import * as React from 'react';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const PageContainer = ({children}: Props) => {
  let location: string = useLocation().pathname
  let padding: string = location === '/login' || location === '/sign-up' 
    ? '0'
    : '5'

  return (
      <div className={`container py-${padding} min-vh-100`}>
        {children}
      </div>
  )
}

export default PageContainer