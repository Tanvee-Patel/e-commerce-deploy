import { filterOptions } from '@/config'
import React, { Fragment } from 'react'
import { Label } from '../ui/label'
import { Checkbox } from '../ui/checkbox'
import { Separator } from '../ui/separator'

const Filter = ({ filters, handleFilter }) => {
  return (
    <div className='bg-white rounded-xl overflow-hidden sticky top-16 h-auto'>
      <div className='p-6 border-b'>
        <h2 className='text-2xl font-semibold text-gray-900 tracking-tight'>Filters</h2>
      </div>
      <div className='p-6 space-y-6'>
        {
          Object.keys(filterOptions).map((keyItem) =>
            <Fragment key={keyItem}>
              <div>
                <h3 className='text-lg font-semibold text-gray-800'>{keyItem}</h3>
                <div className='grid gap-4 mt-4'>
                  {
                    filterOptions[keyItem].map((option, index) => (
                      <Label
                        key={index}
                        className="flex items-center gap-3 font-medium text-gray-700 hover:text-gray-900 cursor-pointer transition-colors"
                      >
                        <Checkbox
                          checked={
                            filters && Object.keys(filters).length > 0 &&
                            filters[keyItem] &&
                            filters[keyItem].indexOf(option.id) > -1
                          }
                          onCheckedChange={() => handleFilter(keyItem, option.id)}
                          className="border-gray-300 text-primary-600 focus:ring-primary-500 transition-colors"
                        />
                        {option.label}
                      </Label>
                    ))}
                </div>
              </div>
              <Separator className='my-6' />
            </Fragment>
          )
        }
      </div>
    </div>
  )
}

export default Filter
