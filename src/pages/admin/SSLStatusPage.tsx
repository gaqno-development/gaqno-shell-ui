import React from 'react'
import { SSLChecker } from '@gaqno-dev/frontcore/components/admin'

export default function SSLStatusPage() {
  return (
    <div className="container mx-auto py-6">
      <SSLChecker />
    </div>
  )
}

