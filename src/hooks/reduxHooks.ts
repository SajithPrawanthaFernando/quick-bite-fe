import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { useAppDispatch, useAppState } from "../redux/store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const AppDispatch = () => useDispatch<useAppDispatch>();
export const AppSelector: TypedUseSelectorHook<useAppState> = useSelector;
