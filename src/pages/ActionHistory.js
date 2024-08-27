import React from 'react'
import { CHeader, CContainer } from '@coreui/react'
function ActionHistory() {
  return (
    <>
      {/* Header */}
      <CHeader position="sticky" className="bg-white shadow-sm mb-4">
        <CContainer className="justify-content-center">
          <div className="mx-auto">
            <strong>Action History</strong>
          </div>
        </CContainer>
      </CHeader>


      <div>
        This is the ActionHistory page
      </div>
    </>
  )
}

export default ActionHistory
