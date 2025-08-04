import {createContext, FC, PropsWithChildren, useContext, useEffect, useState} from "react";
import {Input} from "antd";
import {useDomainContext} from "./Domain";

interface ISearchContext {
    searchValue: string
    setSearchValue: (value: string) => void
    disabled: boolean
}

const SearchContext = createContext<ISearchContext | null>(null);

const useSearchContext = () => {
    const context = useContext(SearchContext);

    if (!context) {
        throw new Error("Try to use Search context without provider");
    }

    return context;
}

const SearchContextProvider: FC<PropsWithChildren> = ({children}) => {
    const {url, searchFields} = useDomainContext()
    const [searchValue, setSearchValue] = useState(() => "");

    useEffect(() => {
        setSearchValue("")
    }, [url])

    const value: ISearchContext = {
        searchValue,
        setSearchValue,
        disabled: searchFields.length === 0,
    }

    return <SearchContext.Provider value={value}>
        {children}
    </SearchContext.Provider>
}

const SearchInput = () => {
    const {searchValue, setSearchValue, disabled} = useSearchContext()

    return <Input.Search
        disabled={disabled}
        style={{maxWidth: 400}}
        placeholder={"Найти"}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
    />
}

export {useSearchContext, SearchContextProvider, SearchInput}