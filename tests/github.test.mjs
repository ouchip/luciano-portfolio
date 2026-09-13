import test from 'node:test';
import assert from 'node:assert/strict';
import {parseContributions} from '../lib/github.ts';
function fixture(){return Array.from({length:365},(_,i)=>{const date=new Date(Date.UTC(2025,8,14+i)).toISOString().slice(0,10);return `<td data-level="${i===364?2:0}" data-date="${date}" id="day-${i}"></td><tool-tip for="day-${i}">${i===364?'3 contributions':'No contributions'} on September 13th.</tool-tip>`}).reverse().join('')}
test('calendar preserves real counts and sorts dates, independent of attribute order',()=>{const d=parseContributions(fixture());assert.equal(d.length,365);assert.equal(d[0].date,'2025-09-14');assert.deepEqual(d.at(-1),{date:'2026-09-13',count:3,level:2})});
test('rejects login and changed markup instead of inventing zero contributions',()=>{assert.throws(()=>parseContributions('<html>Sign in</html>'))});
test('rejects missing tooltips instead of misreporting activity',()=>{assert.throws(()=>parseContributions(fixture().replace(/<tool-tip[\s\S]*?<\/tool-tip>/g,'')))});
