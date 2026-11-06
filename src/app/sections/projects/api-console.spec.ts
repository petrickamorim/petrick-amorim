import { TestBed } from '@angular/core/testing';
import { ApiProject, PROJECTS } from '../../data/projects';
import { ApiConsole } from './api-console';

describe('ApiConsole', () => {
  it('keeps a single response when send() is called repeatedly', async () => {
    const project = PROJECTS.find((p): p is ApiProject => p.slug === 'secure-auth')!;
    const fixture = TestBed.createComponent(ApiConsole);
    fixture.componentRef.setInput('project', project);
    fixture.detectChanges();
    await fixture.whenStable();

    const el = fixture.nativeElement as HTMLElement;
    const sends = Array.from({ length: 5 }, () => fixture.componentInstance.send());
    await Promise.all(sends);
    fixture.detectChanges();

    const res = el.querySelector('.res')!;
    expect(res.querySelectorAll('.ok').length).toBe(1);
    expect(res.querySelector('.body')!.textContent).toBe(project.responseBody);
  }, 30000);
});
