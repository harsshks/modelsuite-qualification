import { useState, useRef, useEffect } from 'react';

const CustomSelect = ({ 
  name, 
  value, 
  onChange, 
  options = [], 
  placeholder = "Select...", 
  className = "",
  disabled = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectRef = useRef(null);
  const inputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isOpen) return;
      
      if (event.key === 'Escape') {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(option => option.value === value);

  const handleSelect = (optionValue) => {
    onChange({ target: { name, value: optionValue } });
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Focus on search input when opening
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  return (
    <div ref={selectRef} className={`relative ${className}`}>
      {/* Select button */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`
          w-full bg-bg-input border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary 
          outline-none transition-all font-sans text-left flex items-center justify-between
          hover:border-border-light focus:border-primary focus:ring-[3px] focus:ring-primary/15
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isOpen ? 'border-primary ring-[3px] ring-primary/15' : ''}
        `}
      >
        <span className={selectedOption ? 'text-text-primary' : 'text-[#4e4a6e]'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg 
          className={`w-3 h-3 text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 12 12"
        >
          <path 
            d="M1 4l5 5 5-5" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            fill="none" 
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-bg-surface border border-border rounded-lg shadow-lg max-h-60 overflow-hidden">
          {/* Search input for long lists */}
          {options.length > 5 && (
            <div className="p-2 border-b border-border">
              <input
                ref={inputRef}
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-bg-input border border-border rounded px-2 py-1 text-sm text-text-primary outline-none placeholder:text-[#4e4a6e] focus:border-primary"
              />
            </div>
          )}
          
          {/* Options list */}
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-text-muted">
                {searchTerm ? 'No matches found' : 'No options available'}
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`
                    w-full text-left px-3 py-2 text-sm transition-colors hover:bg-bg-hover
                    ${option.value === value 
                      ? 'bg-primary text-white' 
                      : 'text-text-primary'
                    }
                  `}
                >
                  {option.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;