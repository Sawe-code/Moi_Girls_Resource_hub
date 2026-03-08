"use client";
import Image from 'next/image'
import { SearchBarProps } from '@/types';

const SearchBar = ({ value, onChange, onSubmit }: SearchBarProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit();
    }
  }
  return (
    <form className='search' onSubmit={handleSubmit}>
      <div>
        <Image src="/icons/search.svg" alt="Search icon" width={20} height={20} />
        <input 
          type="text"
          placeholder="Search by subject, year, or exam type..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label='Search exam papers'
        />
      </div>
    </form>
  )
}

export default SearchBar