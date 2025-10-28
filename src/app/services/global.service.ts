import { inject, Injectable, Injector } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class GlobalService {
    injector = inject(Injector);
    constructor() {}
    getUniqueListBy(arr: any[], key: string = 'value') {
        return [...new Map(arr.map((item) => [item[key], item])).values()];
    }
    public rowsPerPageOptions = [5, 10, 20, 100];

    /** ถ้าไม่ผ่านจะ return true */
    validate(value: any): boolean {
        if (value === null || value == 'null' || value === undefined || value == 'undefined') {
            return true;
        } else if (typeof value === 'string') {
            return !value;
        } else if (typeof value === 'number') {
            return isNaN(value);
        } else if ('object' === typeof value && value instanceof Date) {
            return false;
        } else if ('object' === typeof value && !Array.isArray(value)) {
            return Object.keys(value).length === 0;
        } else if ('object' === typeof value && Array.isArray(value)) {
            return value.length === 0;
        }
        return false;
    }

    isValidDate(dateString: string) {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!RegExp(regex).exec(dateString)) return false;

        const date = new Date(dateString);
        const timestamp = date.getTime();

        if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) return false;

        return date.toISOString().startsWith(dateString);
    }

    nullToEmpty(s: string): string {
        return this.validate(s) ? '' : s;
    }

    encodeBase64(string: string): string {
        const codeUnits = new Uint16Array(string.length);
        for (let i = 0; i < codeUnits.length; i++) {
            codeUnits[i] = string.charCodeAt(i);
        }
        return window.btoa(String.fromCharCode(...new Uint8Array(codeUnits.buffer)));
    }

    encodeIdBase64(id: number): string | null {
        if (!this.validate(id)) return null;
        return window.btoa(`${id}`);
    }


    decodeIdBase64(data: string) {
        let str = structuredClone(data);
        for (let i = 0; i < str.length; i++) {
            str = str.replace('%3D', '=');
        }
        return JSON.parse(window.atob(str));
    }

    backToFirstPage() {
        let pageFirst = document.getElementsByClassName('p-paginator-first')[0] as HTMLElement;
        setTimeout(() => {
            pageFirst?.click();
        }, 50);
    }

    scrollToTop() {
        window.scrollTo(0, 0);
    }

    exportXlsx(data: any, filename: string) {
        const byteCharacters = atob('' + data); // Decode base64
        const byteNumbers = Array.from(byteCharacters, (c) => c.charCodeAt(0));
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/xlsx' });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    exportZip(data: any, filename: string) {
        const byteCharacters = atob('' + data); // Decode base64
        const byteNumbers = Array.from(byteCharacters, (c) => c.charCodeAt(0));
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/zip' });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename.endsWith('.zip') ? filename : `${filename}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }


    exportCSV(data: any, filename: string) {
        const byteCharacters = atob('' + data); // Decode base64
        const byteNumbers = Array.from(byteCharacters, (c) => c.charCodeAt(0));
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/csv' });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    joinApi(segments: Array<string | number>): string {
        const base = environment.apiUrl;
        const path = segments.map((s) => encodeURIComponent(String(s))).join('/');
        return `${base.endsWith('/') ? base : base}/${path}`
    }

    validatePathTraversal(id: number | undefined): void {
        const str = String(id);
        if (!/^\d+$/.test(str)) {
            throw new Error('Path Traversal');
        }
    }
}
