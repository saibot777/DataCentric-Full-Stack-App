import { CentricAppPage } from './app.po';

describe('centric-app App', () => {
  let page: CentricAppPage;

  beforeEach(() => {
    page = new CentricAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
