'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

type Company = {
  cmny_id: number;
  cmny_nm: string;
  biz_no: string | null;
};

type Props = {
  selectedCompany: Company | null;
  onSelectCompany: (company: Company | null) => void;
};

export default function CompanySearch({ selectedCompany, onSelectCompany }: Props) {
  const supabase = createClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // 검색 실행
  useEffect(() => {
    const searchCompanies = async () => {
      if (searchTerm.trim().length < 1) {
        setCompanies([]);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .ilike('cmny_nm', `%${searchTerm}%`)
        .order('cmny_nm')
        .limit(10);

      if (error) {
        console.error('고객사 검색 오류:', error);
      } else {
        setCompanies(data || []);
      }
      setLoading(false);
    };

    const debounce = setTimeout(() => {
      searchCompanies();
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchTerm, supabase]);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (company: Company) => {
    onSelectCompany(company);
    setSearchTerm(company.cmny_nm);
    setIsOpen(false);
  };

  const handleClear = () => {
    onSelectCompany(null);
    setSearchTerm('');
    setCompanies([]);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="flex items-center justify-between">
        <label htmlFor="company-search" className="block text-sm font-medium text-gray-700">
          고객사 검색
        </label>
        {selectedCompany && (
          <span className="text-xs text-green-600">✓ 선택됨</span>
        )}
      </div>
      <div className="relative mt-2">
        <input
          id="company-search"
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="고객사명을 입력하세요"
          className="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
        {selectedCompany && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            <svg
              className="h-5 w-5 text-gray-400 hover:text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* 자동완성 드롭다운 */}
      {isOpen && searchTerm.trim().length > 0 && (
        <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg">
          {loading ? (
            <div className="px-4 py-3 text-sm text-gray-500">검색 중...</div>
          ) : companies.length > 0 ? (
            <ul className="max-h-60 overflow-auto rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {companies.map((company) => (
                <li
                  key={company.cmny_id}
                  onClick={() => handleSelect(company)}
                  className="relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white"
                >
                  <div className="flex items-center justify-between">
                    <span className="block truncate font-medium">{company.cmny_nm}</span>
                    {selectedCompany?.cmny_id === company.cmny_id && (
                      <svg
                        className="h-5 w-5 text-indigo-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  {company.biz_no && (
                    <span className="block truncate text-xs text-gray-500">
                      사업자번호: {company.biz_no}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500">검색 결과가 없습니다.</div>
          )}
        </div>
      )}
    </div>
  );
}

