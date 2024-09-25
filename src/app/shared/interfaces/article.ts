export interface Article {
    ID?: number,
    CID?:number,
    UID?:number,
    CreateAt?: string,
    UpdateAt?: string,
    Title: string,
    Desc: string,
    Content: string,
    Cover?:string,
    PageView?: number
}