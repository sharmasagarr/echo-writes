'use client';

import { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { useTheme } from 'next-themes';
import { getAllCategories } from '@/lib/utils';

type CategoryOption = {
  value: string;
  label: string;
};

interface CategoryInputProps {
  category: CategoryOption | null;
  setCategory: (option: CategoryOption | null) => void;
}

const CategoryInput: React.FC<CategoryInputProps> = ({ category, setCategory }) => {
  const [options, setOptions] = useState<CategoryOption[]>([]);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const fetchCategories = async () => {
      const fetched = await getAllCategories();
      setOptions(fetched);
    };
    fetchCategories();
  }, []);

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: isDark ? '#374151' : '#ffffff',
      borderColor: state.isFocused ? '#3b82f6' : isDark ? '#374151' : '#d1d5db',
      boxShadow: state.isFocused ? '0 0 0 1.5px rgba(59, 130, 246)' : 'none',
      borderRadius: '0.5rem',
      padding: '10px 8px',
      fontSize: '1rem',
      color: isDark ? '#f9fafb' : '#111827',
      ':hover': {
        borderColor: state.isFocused ? '#3b82f6' : isDark ? '#374151' : '#d1d5db',
      },
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: isDark ? '#f9fafb' : '#111827',
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      zIndex: 20,
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? '#3b82f6'
        : state.isFocused
        ? isDark
          ? '#374151'
          : '#e0f2fe'
        : isDark
        ? '#1f2937'
        : '#ffffff',
      color:
        state.isSelected || state.isFocused
          ? isDark
            ? '#f9fafb'
            : '#111827'
          : isDark
          ? '#d1d5db'
          : '#111827',
      padding: '12px 16px',
      cursor: 'pointer',
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#9ca3af',
    }),
    input: (provided: any) => ({
      ...provided,
      color: isDark ? '#f9fafb' : '#111827',
    }),
  };

  return (
    <div className="mb-5">
      <label
        htmlFor="category"
        className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2"
      >
        Category
      </label>
      <CreatableSelect
        inputId="category"
        options={options}
        value={category}
        onChange={(selectedOption) => setCategory(selectedOption)}
        isClearable
        isSearchable
        placeholder="e.g. Technology, Travel, Food"
        styles={customStyles}
        theme={(baseTheme) => ({
          ...baseTheme,
          borderRadius: 6,
          colors: {
            ...baseTheme.colors,
            primary25: isDark ? '#374151' : '#e0f2fe',
            primary: '#3b82f6',
            neutral0: isDark ? '#1f2937' : '#fff',
            neutral80: isDark ? '#f9fafb' : '#111827',
          },
        })}
        className='shadow-sm rounded-lg'
        isValidNewOption={() => false}
      />
    </div>
  );
};

export default CategoryInput;
