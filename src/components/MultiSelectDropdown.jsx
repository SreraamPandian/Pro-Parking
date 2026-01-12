import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Check, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MultiSelectDropdown = ({ options, selected, onChange, placeholder, icon: Icon, label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Auto-focus search input when dropdown opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current.focus(), 100);
        }
    }, [isOpen]);

    const filteredOptions = useMemo(() => {
        if (!searchTerm) return options;
        return options.filter(opt =>
            opt.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [options, searchTerm]);

    const toggleOption = (option) => {
        const isSelected = selected.includes(option);
        if (isSelected) {
            onChange(selected.filter(item => item !== option));
        } else {
            onChange([...selected, option]);
        }
    };

    const isAllSelected = options.length > 0 && selected.length === options.length;

    const toggleAll = (e) => {
        e.stopPropagation();
        if (isAllSelected) {
            onChange([]);
        } else {
            onChange([...options]);
        }
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            {label && <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">{label}</label>}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between w-full pl-4 pr-3 py-2.5 bg-white border ${isOpen ? 'border-primary-blue ring-2 ring-primary-blue/5' : 'border-gray-200'} rounded-xl cursor-pointer transition-all hover:bg-gray-50/50 shadow-sm`}
            >
                <div className="flex items-center overflow-hidden mr-2">
                    {Icon && <Icon size={16} className={`${isOpen ? 'text-primary-blue' : 'text-gray-400'} mr-2.5 flex-shrink-0`} />}
                    <span className={`text-sm truncate font-medium ${selected.length > 0 ? 'text-gray-800' : 'text-gray-400'}`}>
                        {selected.length === 0 ? placeholder :
                            isAllSelected ? `All ${label}s` :
                                selected.length === 1 ? selected[0] :
                                    `${selected.length} Selected`}
                    </span>
                </div>
                <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary-blue' : ''}`} />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute z-[100] mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-2xl shadow-blue-900/10 overflow-hidden py-3"
                    >
                        {/* Search Input */}
                        <div className="px-3 mb-2">
                            <div className="relative">
                                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-transparent focus:bg-white focus:border-primary-blue/20 rounded-xl text-sm outline-none transition-all font-medium placeholder:text-gray-400"
                                    placeholder={`Search ${label}...`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => e.stopPropagation()}
                                    onClick={(e) => e.stopPropagation()}
                                />
                                {searchTerm && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setSearchTerm(''); }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-lg transition-colors text-gray-400"
                                    >
                                        <X size={12} />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="max-h-60 overflow-y-auto custom-scrollbar">
                            {!searchTerm && options.length > 0 && (
                                <>
                                    <div
                                        onClick={toggleAll}
                                        className="px-4 py-2.5 hover:bg-blue-50 transition-colors cursor-pointer flex items-center group"
                                    >
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center mr-3 transition-colors ${isAllSelected ? 'bg-primary-blue border-primary-blue' : 'border-gray-300 group-hover:border-primary-blue'}`}>
                                            {isAllSelected && <Check size={10} className="text-white" />}
                                        </div>
                                        <span className={`text-sm font-bold ${isAllSelected ? 'text-primary-blue' : 'text-gray-600'}`}>Select All</span>
                                    </div>
                                    <div className="h-px bg-gray-50 my-1" />
                                </>
                            )}
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map(option => {
                                    const isSelected = selected.includes(option);
                                    return (
                                        <div
                                            key={option}
                                            onClick={(e) => { e.stopPropagation(); toggleOption(option); }}
                                            className="px-4 py-2.5 hover:bg-blue-50 transition-colors cursor-pointer flex items-center group"
                                        >
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center mr-3 transition-colors ${isSelected ? 'bg-primary-blue border-primary-blue' : 'border-gray-300 group-hover:border-primary-blue'}`}>
                                                {isSelected && <Check size={10} className="text-white" />}
                                            </div>
                                            <span className={`text-sm font-medium ${isSelected ? 'text-gray-900 font-bold' : 'text-gray-600'}`}>{option}</span>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="px-4 py-8 text-center bg-gray-50/30 m-2 rounded-xl border border-dashed border-gray-100">
                                    <Search size={24} className="mx-auto text-gray-200 mb-2" />
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">No results found</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MultiSelectDropdown;
