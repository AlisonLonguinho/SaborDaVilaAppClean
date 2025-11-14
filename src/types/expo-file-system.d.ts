declare module 'expo-file-system' {
  export * from 'expo-file-system/build/FileSystem';
  export const documentDirectory: string | null;

    export function copyAsync(arg0: { from: string; to: string; }) {
        throw new Error("Function not implemented.");
    }

    export function getInfoAsync(DB_SOURCE_PATH: string) {
        throw new Error("Function not implemented.");
    }
}
