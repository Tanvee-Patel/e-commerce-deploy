import React from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';

const Form = ({ formControlls, formData, setFormData, onSubmit, buttonText, isBtnDisabled }) => {

  function renderInputsByComponentType(controlItem) {
    const { name, componentType, placeholder, type, options, label } = controlItem;
    const value = formData[name] || '';

    switch (componentType) {
      case 'input':
        return (
          <div className="relative w-full">

            <Input
              name={name}
              placeholder={placeholder}
              id={name}
              type={type}
              value={value}
              className={`pl-10 w-full border rounded-xl p-2 bg-gray-100 focus:outline-none`}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [name]: e.target.value,
                })}
            />
          </div>
        );

      case 'select':
        return (
          <Select
            onValueChange={(value) =>
              setFormData((prevData) => ({
                ...prevData,
                [name]: value,
              }))
            }
            value={formData[name] || ''}
          >
            <SelectTrigger className="max-w-full rounded-xl">
              <SelectValue placeholder={label} />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {options.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'textarea':
        return (
          <Textarea
            className="rounded-xl"
            name={name}
            placeholder={placeholder}
            id={name}
            value={value}
            onChange={(e) => setFormData({
              ...formData,
              [name]: e.target.value,
            })}
          />
        );

      default:
        return (
          <Input
            className='border rounded-xl mb-2'
            name={name}
            placeholder={placeholder}
            id={name}
            type={type}
            value={value}
            onChange={(e) => setFormData({
              ...formData,
              [name]: e.target.value,
            })}
          />
        );
    }
  }


  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControlls.map(controlItem => (
          <div key={controlItem.name} className="grid max-w-full gap-1.5">
            <Label className="mb-1">
              {controlItem.label}
            </Label>
            {renderInputsByComponentType(controlItem)}
          </div>
        ))}
      </div>
      <Button
        disabled={isBtnDisabled}
        type="submit"
        className={`rounded-xl mt-8 max-w-full ${buttonText === 'Edit' ? 'bg-green-400 hover:bg-green-500' : 'bg-blue-400 hover:bg-blue-500'} font-semibold`} >
        {buttonText || 'Submit'}
      </Button>
    </form>
  );
};

export default Form;
