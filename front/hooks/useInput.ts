import { useCallback,useState, Dispatch, SetStateAction, ChangeEvent } from "react"

//react에서 제공하는 hook을 합쳐서 새로운 하나의 hook을 만든것 => custom hook

type ReturnTypes<T> = [T, (e: ChangeEvent<HTMLInputElement>) => void, Dispatch<SetStateAction<T>>]
// typescript의 장점 가독성은 조금 떨어지나 안정성이 높아짐

const useInput = <T>(InitialData :T) : ReturnTypes<T> => {
  const [value, setValue] = useState(InitialData)
  const handler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue((e.target.value as unknown) as T)
  },[])
  return [value, handler, setValue]
}

export default useInput;