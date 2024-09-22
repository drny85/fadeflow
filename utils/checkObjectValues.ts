export function checkObjectValues<T extends object>(obj: T, x: keyof T): boolean {
   return Object.keys(obj).every((key) => {
      if (key === x) {
         return true; // Skip the key passed in `x`
      }
      const value = obj[key as keyof T];
      return value !== undefined && value !== null && value !== ''; // Check if value is present
   });
}
