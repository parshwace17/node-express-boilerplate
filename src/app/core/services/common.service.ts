import * as bcrypt from 'bcrypt';
import { Service } from 'typedi';

@Service()
export class CommonService {

  constructor() { }

  async generateUniqueUUID(entity: any, user_id: number) {
    const uuid = await this.generateRandomString(6, true);
    const checkUUID = await entity.findOne({
      where: { circle_code: uuid, user_id }
    });
    return checkUUID ? false : uuid;
  }

  async generateRandomString(len?: number, onlyNumber?: boolean) {
    const length = len || 12;
    let passwd = '';
    let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    if (onlyNumber) {
      chars = '0123456789';
    }
    for (let i = 1; i <= length; i++) {
      const c = Math.floor(Math.random() * chars.length);
      passwd += chars.charAt(c).toString();
    }
    return passwd;
  }

  public fileName(name: string, ext: string): string {
    const date = new Date();
    return `${name}-${date.getTime()}.${ext}`;
  }

  /**
   * For creating pagination
   * @param totalRecords
   * @param pageNumber
   * @param recordPerPage
   * @param data
   */
  createPagination(
    totalRecords: number,
    pageNumber: number,
    recordPerPage: number,
    data: any,
  ) {
    const pages = Math.ceil(totalRecords / recordPerPage);
    return {
      totalRecords,
      currentPage: pageNumber,
      recordPerPage,
      previous:
        pageNumber > 0 ? (pageNumber === 1 ? null : pageNumber - 1) : null,
      pages,
      next: pageNumber < pages ? pageNumber + 1 : null,
      data,
    };
  }

  /**
   * Simple password hashing method
   * @param password
   */
  async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  /**
   * validate text with hash
   * @param {string} password
   * @param {string} hash
   * @returns {Promise<boolean>}
   */
  async validateHash(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash || '');
  }

}
