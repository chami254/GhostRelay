

export interface ContactRequest {
  publicKey: string;
}

export interface Contact {
  id: string;
  name: string;
  publicKey: string;
  fingerprint: string;
}
export async function saveContact({
  publicKey,
}: {
  publicKey: string;
}): Promise<Contact> {

  // TODO:
  // POST /contacts

  return {
    id: Date.now().toString(),
    name: "New Contact",
    publicKey,
    fingerprint: "D7:A4:9C:4B:11:3F:9E:AA",
  };
}

export async function getContacts()
: Promise<Contact[]> {

  // TODO:
  // GET /contacts

  return [

      {

          id:"1",

          name:"Alice",

          publicKey:"...",

          fingerprint:"D7:A4:9C:4B",

      },

      {

          id:"2",

          name:"Nova",

          publicKey:"...",

          fingerprint:"B1:22:FF:8C",

      },

  ];

}