import React from 'react'
import Card from '../../components/layout/Card'
const BusinessOverview = () => {
  return (
    <div className='w-full p-4'>
        {/* The business name */}
        <h1 className='text-3xl font-bold mb-4'>Business Overview</h1> 
          <Card classNamew="w-full"/>
        <div className="mt-4">
            <h2 className="text-2xl font-semibold mb-4">Recent Activities
                <span className="text-gray-500 text-sm"> (Last 30 days)</span>
            </h2>   
        </div>
    </div>
  )
}

export default BusinessOverview