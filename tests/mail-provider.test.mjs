import test from 'node:test';
import assert from 'node:assert/strict';
import {addressedToMailbox,getReceived,providerRequest} from '../lib/mail/provider.ts';
test('only the exact owner mailbox may be imported',()=>{assert.equal(addressedToMailbox({to:['Luchi <LUCHI@lucianopinilla.com>'],cc:[]}),true);assert.equal(addressedToMailbox({to:['someone@lucianopinilla.com'],cc:[]}),false);assert.equal(addressedToMailbox({to:['luchi@lucianopinilla.com.evil.example'],cc:[]}),false)});
test('missing credentials and invalid IDs fail before network access',async()=>{await assert.rejects(providerRequest('','/emails/receiving'));await assert.rejects(getReceived('unused','../../domains'))});
