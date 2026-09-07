import ShopByCategory from '@/components/shopByCategory/shopByCategory'
import React from 'react'

const DynamicCategory = () => {
    const {slug} = params
  return (
    <div>
        <ShopByCategory/>
    </div>
  )
}

export default DynamicCategory
