export function checkObjectValues<T extends object>(obj: T, excludeKeys: (keyof T)[]): boolean {
   return Object.keys(obj).every((key) => {
      if (excludeKeys.includes(key as keyof T)) {
         return true; // Skip the keys present in `excludeKeys`
      }
      const value = obj[key as keyof T];
      return value !== undefined && value !== null && value !== ''; // Check if value is present
   });
}
