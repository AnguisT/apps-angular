/**
 * Created by Sergey Trizna on 01.02.2018.
 */
import {Injectable} from "@angular/core";
import {SlickGridProvider} from "../../../providers/slick.grid.provider";
import {SlickGridConfig, SlickGridConfigModuleSetups, SlickGridConfigPluginSetups} from "../../../slick-grid.config";
import {SearchModel} from "../../../../grid/models/search/search";
import {SlickGridPagerComp} from "../pager.comp";

@Injectable()
export class SlickGridPagerProvider {
    public compContext: SlickGridPagerComp;
    private _slickGirdProvider: SlickGridProvider;
    currentPage: number = 1;
    private currentPageNumbers = [];
    private pagerSize = 5;
    get slickGridProvider(): SlickGridProvider {
        return this._slickGirdProvider
    }

    set slickGridProvider(_context: SlickGridProvider) {
        this._slickGirdProvider = _context;
    }

    get provider(): SlickGridProvider {
        return this.slickGridProvider;
    }
    //
    get config(): SlickGridConfig {
        return (<SlickGridConfig>this.provider.config);
    }


    get plugin(): SlickGridConfigPluginSetups {
        return this.config.options.plugin;
    }

    get module(): SlickGridConfigModuleSetups {
        return this.provider.module;
    }


    get lastSearchModel(): SearchModel {
        return this.provider.lastSearchModel;
    }

    private isLastPage(): boolean {
        return (this.module.pager._pages && this.module.pager._pages.length == this.currentPage) ? true : false
    }

    private isFirstPage(): boolean {
        return this.currentPage == 1 ? true : false;
    }

    public setPager(count) {
        this.module.pager._count = count;
        let _tmpStartPage = 1;
        this.module.pager._pages = Array.from({length: Math.ceil(count / this.module.pager.perPage)}, () => _tmpStartPage++);
        this.setPagerView();
    }
    lastPage() {
      this.currentPage = this.getTotalPages();
      this.provider.buildPage(this.lastSearchModel);
      this.setPagerView();
    }

    firstPage() {
      this.currentPage = 1;
      this.provider.buildPage(this.lastSearchModel);
      this.setPagerView();
    }

    nextPage() {
        if (this.module.pager._pages.length > this.currentPage) {
            this.currentPage++;
            this.provider.buildPage(this.lastSearchModel);
            this.setPagerView();
        }
    }

    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.provider.buildPage(this.lastSearchModel);
            this.setPagerView();
        }
    }

    setPage(p: number) {
        if (p > 0 && this.module.pager._pages && p <= this.module.pager._pages.length) {
            this.currentPage = p;
            this.provider.buildPage(this.lastSearchModel);
            this.setPagerView();
        }
    }
    getCurrentPage() {
      return this.currentPage;
    }
    getTotalPages() {
      return this.module.pager._pages.length;
    }
    setPagerView() {
      if (this.getTotalPages() <= this.pagerSize) {
        this.currentPageNumbers = [];
        for (let i = 0; i < this.getTotalPages(); i++) {
          this.currentPageNumbers.push(i + 1);
        }
      } else {
        this.currentPageNumbers = [];
        if (this.getCurrentPage() > 2 && this.getCurrentPage() < (this.getTotalPages() - 1)) {
          let curPage = this.getCurrentPage();
          this.currentPageNumbers = [curPage - 2, curPage - 1, curPage, curPage + 1, curPage + 2];
        } else {
          if (this.getCurrentPage() <= 2) {
            for (let i = 0; i < this.pagerSize; i++) {
              this.currentPageNumbers.push(i + 1);
            }
          }
          if (this.getCurrentPage() >= (this.getTotalPages() - 1)) {
            let totPage = this.getTotalPages();
            for (let i = 4; i >= 0; i--) {
              this.currentPageNumbers.push(totPage - i);
            }
          }
        }
      }
    }
}
