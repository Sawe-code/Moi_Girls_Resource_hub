"use client";
import Image from 'next/image'
import { useState } from 'react'

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(searchTerm);
  }
  return (
    <form className='search' onSubmit={handleSubmit}>
      <div>
        <Image src="/icons/search.svg" alt="Search icon" width={20} height={20} />
        <input 
          type="text"
          placeholder="Search by subject, year, or exam type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label='Search exam papers'
        />
      </div>
    </form>
  )
}

export default SearchBar